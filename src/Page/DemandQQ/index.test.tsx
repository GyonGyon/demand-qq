import { render, screen, fireEvent } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from './index'
import apiValue from 'Request/apiMap'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test App default', () => {
  render(<App />)
  const linkElement = screen.getByText(/name 未找到/i)
  expect(linkElement).toBeInTheDocument()
})

test('test App change', async () => {
  server.use(
    rest.get(apiValue('fetchQQ')[0], (req, res, ctx) => {
      return res(
        ctx.json({
          code: 1,
          name: 'name',
          qq: 'qq',
          qlogo: 'img',
        })
      )
    })
  )

  render(<App />)

  const input = document.querySelector('input') as HTMLInputElement
  expect(input).toBeInTheDocument()

  const name = document.querySelector('.user-name') as HTMLElement
  expect(name).toBeInTheDocument()

  const value = '11111111'
  fireEvent.change(input, { target: { value } })
  expect(input.value).toBe(value)

  await screen.findByText('name')
  await screen.findByText('qq')
})
