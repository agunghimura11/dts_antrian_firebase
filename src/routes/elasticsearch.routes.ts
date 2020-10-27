import { Router } from 'express';
import { ElasticClient } from '../databases/elasticsearch';
const elasticClient = new ElasticClient();

const router = Router();

//@route    GET /es?size=
//@desc     Get all data
router.get('/', async (req, res, next) => {
    const size = Number(req.query.size)
    let accounts;
    try {
        accounts = await elasticClient.getData()
    } catch(error){
        throw error
    }
    res.json(accounts)
});

//@route    GET /state/:state
//@desc     Get account by state
router.get('/state/:state', async (req, res, next) => {
    const state = req.params.state as string 
    let accounts
    try{
        accounts = await elasticClient.getByState(state)
    }catch(error){
        return next(error)
    }
});

//@route    GET /employer/:employer
//@desc     Get account by employer
router.get('/employer/:employer', async (req, res, next) => {
    const {
        state, employer
    } = req.params
    let accounts
    try{
        accounts = await elasticClient.getByEmployer(state, employer)
    } catch(err) {
        return next(err)
    }

    res.json(accounts)
});

//@route    GET /account/:accNumber
//@desc     Get account by account number
router.get('/account/:accNumber', async (req, res, next) => {
    const accNumber = Number(req.params.accNumber)
    let accounts 
    try{
        accounts = await elasticClient.getByAccountNumber(accNumber)
    }catch(err)
    {
        return next(err)
    }

    res.json(accounts)
});

//@route    GET /account/range/:acc1/:acc2
//@desc     Get account in account number range
router.get('/account/range/:acc1/:acc2', async (req, res, next) => {
    const { acc1, acc2 } = req.params
    let accounts
    try {
        accounts = await elasticClient.getByAccountNumberRange([Number(acc1), Number(acc2)])
    } catch(err){
        return next(err)
    }

    res.json(accounts)
});

//@route    GET /age/:age
//@desc     Get account with maximum age
router.get('/age/:age', async (req, res, next) => {
    const age = Number(req.params.age)
    let accounts
    try{
      accounts = await elasticClient.getByAge(age)
    } catch(err){
      return next(err)
    }

    res.json(accounts)
});

export default router;