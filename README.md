# :wrench: How To Configure Your Application For The Pipeline

Configure your application to override default values or just make it better :+1: .

This is done using `labels` in dyour ocker-stack.yml. Any label change will automaticly update [Operations](https://app.kth.se/pipeline/), Nagios, Slack, [UptimeRobot/kthstatus.se](http://kthstatus.se/) and more. Values like name are public and shoudld be understandable by students and employees.

## Automatically added labels by the CD-pipeline

```yml
web:
  labels: se.kth.imageName="my-app"
    se.kth.imageVersion="1.2.3_abcdefg"
```

## Optional configuration for the CD-pipeline

See [kth-azure-app on active](https://gita.sys.kth.se/Infosys/cellus-registry/blob/master/deploy/kth-azure-app/active/docker-stack.yml) for a complete listing of the different labels that can be used to configure your application for the cluster.

### Deployment messages to Slack

se.kth.slackChannels sets what slack channels deployment messages should be posted to. This is in addition to the statically configured slack channel that aspen/alvares uses. Remember to use quotation marks. Multiple channels can be provided by using commas: "#channel1,#channel2".

```yml
- se.kth.slackChannels="#team-pipeline-build,#pipeline-logs"
```

### Team responisble for the application.

Team be notified by UptimeRobot alerts and dashboard group by in Grafana.

**Note!** Do not wrap with " (quotes), this is not handles good by Grafana.

```yml
- se.kth.team=team-studadm
```

### Override default url for keyword monitoring

se.kth.monitorUrl lets you set a specific url to use for monitoring. The url
should be provided in full with protocol and \_monitor endpoint. The endpoint
will be polled for "APPLICATION_STATUS: OK" so make sure you're actually pointing
to a URL that can provide this response. APPLICATION_STATUS: OK can be overridden by
`se.kth.monitorPattern`.

se.kth.monitorPattern defaults to _/app-name/\_monitor_

```yml
- se.kth.monitorUrl="https://app.kth.se/kth-azure-app/_monitor"
```

### Override default keyword pattern when monitoring

If your application does not support the KTH monitor pattern APPLICATION_STATUS,
you can set a different pattern that the monitoring should find on the `se.kth.monitorUrl`.

ex: se.kth.monitorPattern="pattern-that-should-exist-on-page

se.kth.monitorPattern defaults to _APPLICATION_STATUS: OK_

```yml
- se.kth.monitorPattern="ENV_TEST"
```

### Specify the applications incident response time

Is this application important for any form of operations, or support to act upon.

se.kth.importance defaults to _low_.

Values:

- `low`
- `medium`
- `high`

[Full definitions](https://app.kth.se/pipeline/#irt).

```yml
- se.kth.importance="medium"
```

### Public name in English

Shown to customers. Use a descriptive text and keep it simple. If not set will default to
se.kth.publicName.swedish. If no swedish name is specified either, the last fallback values is `se.kth.imageName`.

```yml
- se.kth.publicName.english="Continuous Delivery Reference Application"
```

### Public name in Swedish

Shown to customers. Use a descriptive text and keep it simple.

se.kth.publicName.swedish defaults to _se.kth.publicName.english_

```yml
- se.kth.publicName.swedish="Continuous delivery referens applikation"
```

### Application description in Swedish

Shown to customers. Use a descriptive text and keep it simple.

se.kth.publicName.swedish defaults to _se.kth.imageName_

```yml
- se.kth.description.swedish="Referens applikation för KTH:s Docker kluster i Azure. Om denna tjänst har diftsörning har hela klustret problem."
```

### Application description in English

Shown to customers. Use a descriptive text and keep it simple.

```yml
- se.kth.description.english="Reference application for KTHs Docker clusters."
```

### A link to the user manual or public description of the service.

Its preferred that the link target is public but a link to Confluence is better for the Support then nothing ;)

```yml
se.kth.publicUserDocumentationUrl="https://confluence.sys.kth.se/confluence/displa/EV/Continuous+Delivery+Pipeline+med+Docker"
```

if the link contains the string "swager" a swagger icon will be shown besides the link.

```yml
se.kth.publicUserDocumentationUrl="https://api.kth.se/api/pipeline/swagger"
```

### Detectify

Scan profile to use for detectify integration Found in Detectify url E.g: https://detectify.com/dashboard/1bc26e2de26f1af4c73d8d76c89e496d/settings

```yml
- se.kth.detectify.profileToken="1bc26e2de26f1af4c73d8d76c89e496d"
```

### Accessibility test

Perform a Google Lighthouse accessibility test against the deployed root url after this application has been deployed

```yml
- se.kth.testAccessibility="true"
```

### Override accessibility testing urls

Override the published url for the application with a comma separated list of ABSOLUTE urls that should be scanned with lighthouse. Please note that each url will be very cost intensive in terms of resources, so try and limit these urls to a minimum. ex: - se.kth.accessibilityUrls="https://www.kth.se,https://www.google.com"

```yml
- se.kth.accessibilityUrls="https://app.kth.se/kth-azure-app/"
```
