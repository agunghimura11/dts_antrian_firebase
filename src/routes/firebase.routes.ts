import { Router } from 'express';
import { FirebaseClient } from '../databases/firebase';
const firebaseClient = new FirebaseClient();

const router = Router();

// Antrian
//@route    GET /fb/account
//@desc     Get all account data
router.get('/antrian', async (req, res, next) => {
  let antrian
  try {
      antrian = await firebaseClient.getAntrian()

  }catch (err){
    return next(err)
  }
  res.json(antrian)
});

//@route    GET /fb/antrian/:id
//@desc     Get antrian by Id
router.get('/antrian/:id', async (req, res, next) => {
  const id = req.params.id
  let antroan
  try {
    antroan = await firebaseClient.getAntrianById(id)
  }catch(err){
      return next(err)
  }
  res.json(antroan)
});

//@route    GET /fb/add_antrian/:id
//@desc     Add new antrian
router.get('/add_antrian/', async (req,res,next) => {
  const id = req.params.id
  let antrian
  try{
    antrian = await firebaseClient.addAntrian()
  }catch(err){
    return next(err)
  }
  res.json({
    message: "Add antrian success",
    no_antrian: antrian
  })
})

//@route    PUT /fb/done_antrian/:id
//@desc     Antrian dilayani teller, set status true
router.put('/done_antrian/:id', async (req,res,next) => {
  const id = req.params.id
  try{
     await firebaseClient.doneAntrianById(id)
  }catch(err){
    return next(err)
  }
  
  res.json({
    message: "antrian selesai dilayani"
  })
})

//@route    PUT /fb/done_antrian/:id
//@desc     Antrian dilayani teller, set status true
// router.get('/first_antrian/', async (req,res,next) => {
//   const id = req.params.id
//   let result
//   try{
//     result = await firebaseClient.firstAntrian()
//   }catch(err){
//     return next(err)
//   }
  
//   res.json(result)
// })

//@route    GET /fb/antrian/:id
//@desc     Get antrian by Id
router.get('/range_antrian/:from/:to', async (req, res, next) => {
  const _from = Number(req.params.from)
  const _to = Number(req.params.to)
  let setting
  try {
    setting = await firebaseClient.setAntrianRange(_from, _to)
  }catch(err){
      return next(err)
  }
  res.json({
    "message": "setting range success",
    "setting": setting
  })
});

//Account
//@route    POST /fb/account
//@desc     Add account data
router.post('/account', async (req, res, next) => {
    const account = req.body
    try{
        await firebaseClient.addData(account)
    }catch(err){
        throw err
    }

    res.json({
        message: 'success'
    })
});

//@route    GET /fb/account
//@desc     Get all account data
router.get('/account', async (req, res, next) => {
  let accounts
  try {
      accounts = await firebaseClient.getData()

  }catch (err){
    return next(err)
  }
  res.json(accounts)
});

//@route    GET /fb/account/:id
//@desc     Get account by Id
router.get('/account/:id', async (req, res, next) => {
  const id = req.params.id
  let account
  try {
    account = await firebaseClient.getDataById(id)
  }catch(err){
      return next(err)
  }
  res.json(account)
});

//@route    PUT /fb/account/:id
//@desc     Update account by id
router.put('/account/:id', async (req, res, next) => {
    const id = req.params.id
    const update = req.body
    let account
    try {
      await firebaseClient.updateData(id, update)
    }catch(err){
        return next(err)
    }
    res.json({
        message: 'Data update'
    })
});

//@route    DELETE /fb/account/:id
//@desc     Delete accoubt by id
router.delete('/account/:id', async (req, res, next) => {
    const id = req.params.id
    const update = req.body
    let account
    try {
      await firebaseClient.deleteData(id)
    }catch(err){
        return next(err)
    }
    res.json({
        message: 'Data delete'
    })
});

//@route    GET /fb/account/number/:accNum
//@desc     Get account by account number
router.get('/account/state/:accNum', async (req, res, next) => {
  const state = req.params.state
  let account
  try{
      account = await firebaseClient.getDataByState(state)
  }catch(err){
      return next(err)
  }

  res.json(account)
});

//@route    GET /fb/account/age/:age
//@desc     Get account by age
router.get('/account/age/:age', async (req, res, next) => {
  const age = Number(req.params.age)
  let accounts
  try{
    accounts = await firebaseClient.getDataByAge(age)
  }catch(err){
      return next(err)
  }

  res.send(accounts)
});

export default router;