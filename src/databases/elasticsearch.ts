import { Client } from 'elasticsearch';

const client = new Client({
  host: process.env.ELASTICSEARCH_HOST
});


export class ElasticClient {
  private client: Client;

  constructor() {
    this.client = client;
  }

  async getData(size?: number) {
    let result;
    try {
        result =  await client.search({
          index: 'accounts',
          size: size ? size : 10,
        })
    } catch(err) {
      throw err
    }

    return result
  }

  async getByState(state: string) {
    let result;
    try {
        result =  await client.search({
          index: 'accounts',
          body : {
            query: {
              state
            }
          }
        })
    } catch(err) {
      throw err
    }

    return result
  }

  async getByEmployer(state: string, employer: string) {
    let result
    try {
      result = await client.search({
        index: 'accounts',
        body: {
          query: {
            bool: {
              must : [
                {
                  match : {
                    state,
                  }
                },
                {
                  match : {
                    employer,
                  }
                }
              ]
            }
          }
        }
      })
    } catch(err) {
      throw err
    }
  }

  async getByAccountNumber(accountNumber: number) {
    let result
    try{
      result = await client.search({
        index: 'accounts',
        body: {
          query : {
            term:{
              account_number: accountNumber
            }
          }
        }
      })
    }catch(err)
    {
      throw err
    }
    return result
  }

  async getByAccountNumberRange(accountNumbers: number[]) {
    let result
    const [acc1, acc2] = accountNumbers
    try{
      result = await client.search({
        index : 'accounts',
        body : {
          query: {
            range: {
              account_number: {
                gte: acc1,
                lte: acc2
              }
            }
          }
        }
      })
    }catch(err){
      throw err
    }

    return result
  }

  async getByAge(age: number) {
    let result
    try{
      result = await client.search({
        index: 'accounts',
        body:{
          query:{
            age,
          }
        }
      })
    }catch(err){
      throw err
    }

    return result
  }
}