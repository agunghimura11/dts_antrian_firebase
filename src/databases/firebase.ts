import admin, { firestore } from 'firebase-admin';
import { serviceAccountCredentials } from '../serviceAccountKey';
import quque from './quque';
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
  account_number: number
  no_antrian: number // no antrian, generate dari sistem
  status: boolean // true jika sudah dilayani teller, default: false
  time_start: Date // waktu mengambil antrian
  time_finish: Date // waktu selesai pelayanan, default: null
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
      snapshot = await this.antrianRef.get()
    }catch(err){
      throw err
    }
    
    return snapshot.docs.map(doc => doc.data())
  }

  async getAntrianById(id: string) {
    let snapshot
    try{
      snapshot = await antrianRef.doc(id).get()
    }catch(err){
      throw err
    }

    return snapshot.data()
  }

  // buat antrian baru, dengan memasukan id user serta memanggil class queue
  async addAntrian(){
    let data: Antrian 
    // cek apakah antrian kosong, jika kosong generate baru
    if(Queue.isEmpty()){
      Queue.generate()
    }
    const q = Queue.enqueue()
    Queue.dequeue()
    console.log(q)
    const time = new Date().getTime()
    try{
      await antrianRef.add({
        no_antrian: q[0], //antrian pertama
        status: false, // status apakah sudah dilayani, jika true sudah
        time_start: time,
        time_finish: null
      })
    }catch(err){
      throw err
    }
    const no_antrian = Queue.data_antrian()
    return no_antrian[no_antrian.length - 1]
  }
  // Jika selesai dilayani teller by id antrian
  async doneAntrianById(id: string){
    const time = new Date().getTime()
    try{
      await antrianRef.doc(id).update({
        status: true,
        time_finish:time
      })
    }catch(Err){
      throw Err
    }

    return 
  }

  // async firstAntrian(){
  //   let result
  //   const time = new Date().getTime()
  //   const quque_data = Queue.data_antrian() 
  //   const no_antrian = (quque_data === undefined) ? 1 : quque_data[0]
  //   console.log(no_antrian)
  //   try {
  //     result = await antrianRef.where('no_antrian', '==', no_antrian).get()
  //   }catch(err){
  //     throw err
  //   }

  //   return result.docs.map(doc => doc.data())
  // }

  async setAntrianRange(start: number, finish: number){
    let setting
    try{
      setting =  await quque.set_range(start, finish)
    }catch(err){
      throw err
    }
    return setting
  }

  // Account
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

  

}

