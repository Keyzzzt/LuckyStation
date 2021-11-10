import { JSONSchemaType } from 'ajv'
import ajv from '@src/validation/ajvInstance'

interface LoginBody {
  password: string
  email: string
}

const schema: JSONSchemaType<LoginBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', nullable: true },
  },
  required: ['email', 'password'],
  additionalProperties: false,
}

export const validateLoginRequest = ajv.compile(schema)

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)

const data = {
  foo: 1,
  bar: 'abc',
}

if (validate(data)) {
  // data is MyData here
  console.log(data.foo)
} else {
  console.log(validate.errors)
}
