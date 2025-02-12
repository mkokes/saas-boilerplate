# Dokku setup

Dokku docs: <http://dokku.viewdocs.io/dokku>.

## DO server info

`2 GB Memory / 25 GB Disk / NYC1 - Ubuntu Dokku 0.12.13 on 18.04`

## Required plugins

- `dokku-monorepo`: <https://github.com/notpushkin/dokku-monorepo>.
- `dokku-mongo`: <https://github.com/dokku/dokku-mongo>.
- `dokku-hostname`: <https://github.com/michaelshobbs/dokku-hostname>
- `dokku-letsencrypt`: <https://github.com/dokku/dokku-letsencrypt>

## Setup DNS on Cloudflare

![dokku dns](images/dokku/dns.png)
^Points to DO server IP address

## Configuration

```bash
  dokku config:set --global DOKKU_LETSENCRYPT_EMAIL=your@email.tld
  dokku config:set --global DOKKU_LETSENCRYPT_SERVER=default # or stage
```

## Create API DB

```bash
dokku mongo:create db
dokku mongo:expose db

dokku mongo:connect-admin
> use admin
> db.createUser( { user: "user", pwd: "password", roles:["root"] })

dokku mongo:backup-auth db AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
dokku mongo:backup db BUCKET_NAME

# CRON_SCHEDULE is a crontab expression, eg. "0 3 * * *" for each day at 3am
dokku mongo:backup-schedule db CRON_SCHEDULE BUCKET_NAME
```

- AWS IAM: https://console.aws.amazon.com/iam/home?region=us-east-1#/users
- AWS S3: https://s3.console.aws.amazon.com/s3/home?region=us-east-1

## API

```bash
dokku apps:create api

dokku mongo:link db api

dokku domains:add api <domain>

dokku proxy:ports-add api http:80:3000
dokku proxy:ports-remove api http:3000:3000

dokku letsencrypt api

dokku config:set --no-restart api NODE_ENV=production
dokku config:set --no-restart api APP_MODE=live
dokku config:set --no-restart api MONGO_URL=XXX
dokku config:set --no-restart api RECAPTCHA_SECRET_KEY=XXX
dokku config:set --no-restart api JWT_SECRET=XXX
dokku config:set --no-restart api API_SECRET_KEY=XXX
dokku config:set --no-restart api RECAPTCHA_SECRET_KEY=XXX
dokku config:set --no-restart api PADDLE_VENDOR_ID=XXX
dokku config:set --no-restart api PADDLE_VENDOR_AUTH_CODE=XXX
dokku config:set --no-restart api MIXPANEL_TOKEN=XXX
dokku config:set --no-restart api POSTMARK_API_TOKEN=XXX
dokku config:set --no-restart api PAPERTRAIL_APP_HOST=XXX
dokku config:set --no-restart api PAPERTRAIL_APP_PORT=XXX
dokku config:set --no-restart api MAILCHIMP_API_KEY=XXX
dokku config:set --no-restart api MAILCHIMP_API_KEY=XXX
dokku config:set --no-restart api COINBASE_COMMERCE_API_SECRET=XXX
dokku config:set --no-restart api COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET=XXX
```

## Analytics

```bash
  dokku apps:create analytics

  dokku domains:add analytics <domain>

  dokku proxy:ports-add analytics http:80:3000
  dokku proxy:ports-remove analytics http:3000:3000

  dokku letsencrypt analytics

  dokku config:set --no-restart analytics NODE_ENV=production
```

## Scheduler

```bash
  dokku apps:create scheduler

  dokku config:set --no-restart scheduler NODE_ENV=production
  dokku config:set --no-restart scheduler APP_MODE=live
  dokku config:set --no-restart api API_SECRET_KEY=XXX
  dokku config:set --no-restart api PAPERTRAIL_APP_HOST=XXX
  dokku config:set --no-restart api PAPERTRAIL_APP_PORT=XXX
```

## Adding a new application

Add application name and directory path to file `.dokku-monorepo` and ssh to the `Dokku server` to setup your application dokku config (domain, ports, ssl, env config..etc).

## Adding SSH keys

```bash
dokku ssh-keys:add CI /path/to/pub_ci_ssh_key
```
