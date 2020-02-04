# Configuring the application

The application takes a single configuration file -  `configuration.json` - which defines how it will behave.
The master configuration file is at `./src/configuration.json`. In production, you will need to create that
file and place it into the document root of the webserver. Have a look at the configuration of the ui container
in `docker-compose-production.yml` to see an example configuration.

## Configuration options

## domain
If you want to lock the viewer instance to a specific domain then set the domain property. This results in
shortened URLs without the domain name. For example, setting the domain to paradisec.org.au results in 
'/view/AC1/001' instead of '/view/paradisec.org.au/AC1/001'. The application still assumes the content being
served has the domain name but it will insert it where required in order to map the route path to the
content that needs to be loaded.

## Data Formats
These options determine the content that gets extacted from the `hasPart` property of the ro-crate file. You
probably don't want to change these unless you've revised the respective components to handle the new data
types you've added.

### imageFormats, audioFormats, videoFormats
The media formats the application will try to display. Ensure that whatever you put here is supported by all browsers.

### documentFileExtensions
These are the extensions supported by google document viewer. See: https://gist.github.com/tzmartin/1cf85dc3d975f94cfddc04bc0dd399be for more information.

### transcriptionFileExtensions
You probably don't want to change this.

## service.search and service.api
**API is currently not used**. `service.search` tells the application where to find elastic. In development
you should leave as `http://localhost:9200` whilst in prod it's likely to be something like `/search` (assuming
you've set up a proxy path via your nginx server to elastic - which you absolutely should do)

## exploreComponent
The `exploreComponent` configuration option tells the app which component to use for the explore 
route. If a component is not defined then the `explore/SimpleSearch.component` is loaded in to the 
view. So, if your deployment requires a specific explore component you can use this option to tell the app to use that as the default.

**IMPORTANT** Given the way the renderer components are loaded you `MUST` define it 
as a path relative to the `explore` folder. Defining it any other way will result 
in the component failing to load.

## introductionComponent

The `introductionComponent` configuration option tells the app which component to use for the 
introduction route. If a component is not defined then the `introduction/GenericIntroduction.component` is loaded in to the view. So, if your deployment requires a specific introduction component you can use this option to tell the app to use that as the default.

**IMPORTANT** Given the way the renderer components are loaded you `MUST` define it 
as a path relative to the `introduction` folder. Defining it any other way will result 
in the component failing to load.

## renderers

The renderers configuration option allows you to define how the content will be rendered.
You can match on the `domain` of the data or the `domain` and `additionalType` of the data.
In the absence of a specific renderer for a given piece of data the application will load
the `GenericViewer.component` to display the basic metadata.

**IMPORTANT** Given the way the renderer components are loaded you `MUST` define them 
as paths relative to the view folder. Defining them any other way will result in 
the component failing to load.
