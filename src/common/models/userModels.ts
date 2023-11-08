import type { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore'

export class User {
  constructor(props = {}) {
    Object.assign(this, props)
  }

  id!: string
  name!: string
  email!: string
  password!: string
  isAdmin: boolean = false
  createdAt!: Timestamp
  deletedAt?: Timestamp
}

export const userConverter = {
  toFirestore: (user: User) => ({
    name: user.name,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt
  }),
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions) => {
    return new User({id: snapshot.id, ...snapshot.data(options)})
  }
}
