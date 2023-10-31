export class Category {
  constructor(props = {}) {
      Object.assign(this, props);
  }

  id!: number;
  name!: string;
  property_template!: Array<String>;
  created_at!: string;
  deleted_at!: string;
}
