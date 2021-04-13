const app = require('./server');
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

    (async () => {
        try {
            console.log("Running migrations");
            app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
        } catch {
            process.exit(-1);
        }
    })();