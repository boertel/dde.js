# DDE

Handle multiple environments (dev, test, prod) in Javascript.

## Define your environments

    dde.push({
        host: "test.com",
        name: "test",
        settings: {
            app_id: "1234567890",
            api: "api.test.com"
        }
    });

    dde.push({
        host: "*",
        name: "default",
        settings: {
            app_id: "0987654321",
            api: "api.production.com"
        }
    });

    // It's going to choose the correct environment depending on the host where the application is running 
    dde.work();

    // if you go to: test.com
    console.log(dde.env.name);  // == test

    // ... and any other domain
    console.log(dde.env.name); // == default

