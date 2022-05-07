import { renderHook } from '@testing-library/react';
import useRequestFetchQQ, {switchUserData, ResultQQ} from 'Request/fetchQQ';
import defaultImage from 'Image/defaultImage.jpg'

test('test switchUserData default', () => {
  const result = switchUserData()
  expect(result).toEqual({
    name: 'name 未找到',
    qq: 'qq 未找到',
    img: defaultImage,
  })
});


test('test switchUserData target', () => {
  const result = switchUserData({
    name: 'name',
    qq: 'qq',
    qlogo: 'img',
  } as ResultQQ)
  expect(result).toEqual({
    name: 'name',
    qq: 'qq',
    img: 'img',
  })
});

test('test useRequestFetchQQ', () => {
  const {result} = renderHook(() => useRequestFetchQQ())
  expect(result.current.url).toEqual('https://api.uomg.com/api/qq.info')
  expect(result.current.method).toEqual('get')
});
