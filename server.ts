import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from 'http';
import { Express, Router, Request, Response } from "express";

import * as mockgen from './app/data/mock-data-generator';

const usersPerPage = 20;

const generatedPtUsers = mockgen.generateUsers();
const generatedPtItems = mockgen.generatePTItems(generatedPtUsers);

let currentPtUsers = generatedPtUsers.slice(0);
let currentPtItems = generatedPtItems.slice(0);

function paginateArray(array, pageSize, pageNumber) {
    --pageNumber; // because pages logically start with 1, but technically with 0
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}

/*
const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'Pa$$word1'
};
*/

const app: Express = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app'));


// ROUTES FOR OUR API
//=================================================================
const router: Router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/users', (req: Request, res: Response) => {
    let currentPage = 1;
    if (req.query && req.query.page) {
        currentPage = +req.query.page
    }

    const pagedData = paginateArray(currentPtUsers, usersPerPage, currentPage);

    res.json({
        currentPage: currentPage,
        pageSize: usersPerPage,
        totalItemCount: currentPtUsers.length,
        pageCount: Math.ceil(currentPtUsers.length / usersPerPage),
        data: pagedData
    });
});


router.get('/backlog', (req: Request, res: Response) => {
    res.json(currentPtItems);
});

router.get('/myItems', (req: Request, res: Response) => {
    let userId;
    if (req.query && req.query.userId) {
        userId = req.query.userId
    }
    let found = false;

    if (currentPtUsers.findIndex(u => u.id === userId) >= 0) {
        found = true;
    }

    let filteredItems = currentPtItems.filter(i => i.assignee.id === userId);

    if (!found) {
        res.status(404);
    }
    res.json(filteredItems);
});

router.get('/openItems', (req: Request, res: Response) => {
    let filteredItems = currentPtItems.filter(i => i.status === 2 /*open*/ || i.status === 4 /*reopened*/);
    res.json(filteredItems);
});

router.get('/closedItems', (req: Request, res: Response) => {
    let filteredItems = currentPtItems.filter(i => i.status === 3 /*closed*/);
    res.json(filteredItems);
});

router.get('/photo/:id', (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = currentPtUsers.find(u => u.id === userId && u.dateDeleted === undefined);
    console.log(user);

    let found = false;
    if (user) {
        found = true;
    }

    if (!found) {
        res.status(404);
        res.json(null);
    } else {
        //res.setHeader('Content-Type', 'image/png');
        res.sendFile(`${__dirname}/${user.avatar}`);
    }
});

router.delete('/users/:id', (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    const user = currentPtUsers.find(u => u.id === userId && u.dateDeleted === undefined);

    if (user) {
        user.dateDeleted = new Date();
        res.json({
            id: userId,
            result: true
        });
    } else {
        res.status(404);
        res.json({
            id: userId,
            result: false
        });
    }
});

router.put('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
    const modifiedUser = req.body;

    let found = false;

    const newUsers = currentPtUsers.map(user => {
        if (user.id === userId && user.dateDeleted === undefined) {
            found = true;
            return modifiedUser;
        } else {
            return user;
        }
    });
    currentPtUsers = newUsers;

    if (!found) {
        res.status(404);
    }
    res.json({
        id: userId,
        result: modifiedUser
    });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


const httpServer = http.createServer(app);
//const httpsServer = https.createServer(sslOptions, app);

httpServer.listen(8080);
//httpsServer.listen(8443);