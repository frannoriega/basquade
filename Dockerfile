FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 python3-dev py3-pip pkgconfig cairo pango libpng jpeg giflib librsvg \
pixman build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev postgresql libpq-dev
RUN ln -sf python3 /usr/bin/python
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma prisma
COPY scripts scripts

WORKDIR /app/scripts
RUN python -m venv venv
RUN . venv/bin/activate && pip install psycopg2-binary && pip install -r requirements.txt && \
deactivate

WORKDIR /app

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY public public
COPY prisma prisma
COPY src src
COPY *.js *.ts *.mjs *.json ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ARG PGPASSWORD

RUN addgroup --system --gid 1001 basquade
RUN adduser --system --uid 1001 basquade

RUN apk add python3 py3-pip postgresql g++ supervisor bash libmagic poppler poppler-utils \
tesseract-ocr tesseract-ocr-data-eng tesseract-ocr-data-spa tesseract-ocr-data-por
RUN ln -sf python3 /usr/bin/python


RUN mkdir /run/postgresql
RUN chown postgres:postgres /run/postgresql/
RUN chown postgres:postgres /var/lib/postgresql

WORKDIR /var/lib/postgresql
USER postgres

RUN mkdir /var/lib/postgresql/data
RUN chmod 0700 /var/lib/postgresql/data
RUN initdb -D /var/lib/postgresql/data -A md5 --pwfile=<(echo $PGPASSWORD)
RUN echo "local all all   md5" >> /var/lib/postgresql/data/pg_hba.conf
RUN echo "host all all 0.0.0.0/0   md5" >> /var/lib/postgresql/data/pg_hba.conf
RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf

WORKDIR /app
USER root

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1


COPY --from=builder --chown=basquade:basquade /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown basquade:basquade .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=basquade:basquade /app/.next/standalone ./
COPY --from=builder --chown=basquade:basquade /app/.next/static ./.next/static
COPY --from=deps --chown=basquade:basquade /app/scripts ./scripts

COPY --chown=basquade:basquade docker/supervisord.conf /etc/supervisord.conf
COPY docker/process.sh /etc/periodic/daily/
RUN chown basquade:basquade /var/log

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
