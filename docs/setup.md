# Dokku applications setup (production)

## API

```
dokku apps:create api

dokku mongo:create db
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
dokku config:set --no-restart api RECAPTCHA_SECRET_KEY=XXX
dokku config:set --no-restart api PADDLE_VENDOR_ID=XXX
dokku config:set --no-restart api PADDLE_VENDOR_AUTH_CODE=XXX
dokku config:set --no-restart api POSTMARK_API_TOKEN=XXX
dokku config:set --no-restart api FRESHDESK_SECRET=XXX
```
