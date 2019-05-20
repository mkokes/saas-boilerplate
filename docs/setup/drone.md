# Drone.io - CI/CD

Drone.io docs: <https://docs.drone.io>.

## Needed secrets

- `DOKKU_SSH_KEY`: Dokku private key used to deploy server applications. 
- `netlify_acount_token`: Netlify personal access token used to deploy client applications.
- `slack_webhook`: Slack webhook used to notify succeced/failed builds.

### Adding `DOKKU_SSH_KEY` secret
```
# Example
drone secret add --repository="AMGAVentures/saas-boilerplate"  --name="DOKKU_SSH_KEY" --data @/Users/Alfonso/.ssh/dokku_ci
