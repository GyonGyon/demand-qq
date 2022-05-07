import { useEffect } from 'react';
import { renderHook } from '@testing-library/react';
import Request, {useLoading} from 'Request/base';

test('test useLoading default', () => {
  const request = new Request(['get', ''])
  const {result} = renderHook(() => useLoading(request))
  expect(result.current).toEqual(false)
});

test('test useLoading false', () => {
  const request = new Request(['get', ''])
  const {result} = renderHook(() => useLoading(request, false))
  expect(result.current).toEqual(false)
});

test('test useLoading true', () => {
  const request = new Request(['get', ''])
  const {result} = renderHook(() => useLoading(request, true))
  expect(result.current).toEqual(true)
});

test('test useLoading check request', () => {
  const request = new Request(['get', ''])
  renderHook(() => {
    useLoading(request, true)
    useEffect(() => {
      request.setLoading(false)
    }, [])
  })
  expect(request.loading).toEqual(false)
});
