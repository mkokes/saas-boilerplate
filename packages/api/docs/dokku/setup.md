```
dokku apps:create brandname-env-api

dokku mongo:create brandname-api-env-db
dokku mongo:link brandname-api-env-db brandname-env-api

dokku domains:add brandname-env-api <domain>

dokku proxy:ports-add brandname-env-api http:80:3000
dokku proxy:ports-remove brandname-env-api http:3000:3000

dokku letsencrypt brandname-env-api

dokku config:set --no-restart brandname-env-api NODE_ENV=production
dokku config:set --no-restart brandname-env-api APP_MODE=live
dokku config:set --no-restart brandname-env-api MONGO_URL=XXX
dokku config:set --no-restart brandname-env-api RECAPTCHA_SECRET_KEY=XXX
dokku config:set --no-restart brandname-env-api JWT_SECRET=XXX
dokku config:set --no-restart brandname-env-api RECAPTCHA_SECRET_KEY=XXX
dokku config:set --no-restart brandname-env-api PADDLE_VENDOR_ID=XXX
dokku config:set --no-restart brandname-env-api PADDLE_VENDOR_AUTH_CODE=XXX
dokku config:set --no-restart brandname-env-api POSTMARK_API_TOKEN=XXX
dokku config:set --no-restart brandname-env-api FRESHDESK_SECRET=XXX
```
