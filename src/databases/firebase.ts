import admin, { firestore } from 'firebase-admin';
import { serviceAccountCredentials } from '../serviceAccountKey';
const serviceAccount = serviceAccountCredentials as admin.ServiceAccount;

import Queue from './quque'


export type Account = {
  account_number: number;
  balance: number;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  address: string;
  employer: string;
  email: string;
  city: string;
  state: string;
};

export type Antrian = {
  no_antrian: number
  status: boolean
  account_number: number
  time_start: Date
  time_finish: Date
}

export type No_antrian = {
  no : number
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dts20-fb439.firebaseio.com'
});

const db = admin.firestore();


const accountRef = db.collection('accounts')
const antrianRef = db.collection('antrian')
const NoAntrianRef = db.collection('no_antrian')

export class FirebaseClient {
  private db: FirebaseFirestore.Firestore;
  private accountRef : FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
  private antrianRef : FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
  private NoAntrianRef : FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
 

  constructor() {
    this.db = db;
    this.accountRef = accountRef
    this.antrianRef = antrianRef
    this.NoAntrianRef = NoAntrianRef
   
    
  }

  async addData(account: Account) {
    //const acc = account as firestore.DocumentData
    try{
      await accountRef.add(account)
    }catch(err){
      throw err
    }

    return
  }

  async getData() {
    let snapshot
    try{
      snapshot = await this.accountRef.get()
    }catch(err){
      throw err
    }
    console.log(snapshot)
    return snapshot.docs.map(doc => doc.data())
  }

  async getDataById(id: string) {
    let snapshot
    try{
      snapshot = await accountRef.doc(id).get()
    }catch(err){
      throw err
    }

    return snapshot.data()
  }

  async updateData(id: string, update: Object) {
    let snapshot
    try{
      await accountRef.doc(id).update({
        ...update
      })
    }catch(Err){
      throw Err
    }

    return 
  }

  async deleteData(id: string) {
    try{
      await accountRef.doc(id).delete()
    }catch(err){
      throw err
    }

    return
  }

  async getDataByState(state: string) {
    let snapshot
    try {
      snapshot = await accountRef.where('account_number', '==', state).get()
    } catch(err)
    {
      throw err
    }

    return snapshot.docs.map(doc => doc.data())
  }

  async getDataByAge(age: number) {
    let snapshot
    try{
      snapshot = await accountRef.where('age', '>=', age).get()
    }catch(err)
    {
      throw err
    }

    return snapshot.docs.map(doc => doc.data())
  }

  //antrian

  async generateAntrian() {
    const acc = JSON.parse(JSON.stringify(Queue.enqueue()))
    try{
      await NoAntrianRef.add(acc)
    }catch(err){
      throw err
    }

    return
  }
  
  async getAntrian(){
    let snapshot
    try{
      snapshot = await this.NoAntrianRef.get()
    }catch(err){
      throw err
    }
    console.log(snapshot)
    return snapshot.docs.map(doc => doc.data())
  }

  async addAntrian(id: string){
    let data: Antrian 

    if(Queue.isEmpty()){
      Queue.generate(1,10)
    }
    const q = Queue.enqueue()
    Queue.dequeue()

    const time = new Date().getTime()
    
    await antrianRef.add({
      no_antrian: q[0],
      status: true,
      account_number: id,
      time_start: time,
      time_finish: null
    })
  }

}

