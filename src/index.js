const app = require('./app');
require('./database');
const PORT = 3000;

const init = async() => {
    await app.listen(PORT);
    console.log(`Server ready in port 3000`);
}

init();