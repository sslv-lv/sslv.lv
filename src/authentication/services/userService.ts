import { userConverter } from '@/common/models/userModels'
import { collection, where, query, getDocs, limit } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export async function getUser(email: string, password?: string) {
  const db = useFirestore()

  const constraints = [where('email', '==', email)]

  if (password) {
    constraints.push(where('password', '==', password))
  }

  const userQuery = query(collection(db, 'users').withConverter(userConverter), ...constraints, limit(1))

  return await getDocs(userQuery)
}
