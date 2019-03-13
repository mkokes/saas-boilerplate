# Netlify setup

Website: https://www.netlify.com.

## Requirements

- Generate a Netlify `personal access token` (URL: https://app.netlify.com/account/applications) to add it as `secret` to Drone.io system.

## Setup website application and client application

Repeat this two times for each application:

- Go to Netlify and add your site.
- Go to your site -> Deploys -> click on `Stop auto publishing`.
- Go to your site settings -> Build & deploy -> turn off deploy previews and enable Slack notifications.

## Adding a new site
