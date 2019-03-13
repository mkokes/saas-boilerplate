# Netlify setup

Website: https://www.netlify.com.

## Requirements

- Generate a Netlify `personal access token` (URL: https://app.netlify.com/account/applications) to add it as `secret` to Drone.io system.

## Adding sites (website, front-end client app or a new one)

Repeat this for each site:

- Go to Netlify and click on `add site`.
- Site settings -> Deploys -> click on `Stop auto publishing`.
- Site settings -> Build & deploy -> set `Deploy log visibility to private`, `turn off deploy previews` and `enable Slack notifications` (`Send message to Slack #dev when deploy is locked`).
- Site settings -> Domains -> `Add custom domain`.
- Update `.drone.yml` file to auto-publish the site when new changes are pushed.
