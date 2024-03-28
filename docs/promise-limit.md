### 手写异步并发控制器

1. 需要维护的变量：

- 一个异步任务队列 `queue`
- 一个当前正在异步请求的异步任务总数 `activeCount`

2. 需要实现的方法：

- 入队方法：将异步任务入队，并且将当前正在异步请求的异步任务总数（`activeCount`）加 1
- 运行任务的方法：将传入的异步任务执行
- 运行下一个异步任务方法：将正在执行的异步任务总数（`activeCount`）减 1，然后异步任务队列中如果还有要执行的，出队运行

```JavaScript
function pLimit(maxLimit) {
  const queue = []
  let activeCount = 0

  // 换下一个任务
  const next = () => {
    activeCount--

    if (queue.length && activeCount < maxLimit) {
      queue.shift()?.()
    }
  }

  // 跑任务
  const run = async (fn, resolve, arguments_) => {
    activeCount++

    const result = await fn(...arguments_)

    resolve(result)

    next()
  }

  // 将跑的任务入队
  const enqueue = (fn, resolve, arguments_) => {
    queue.push(run.bind(null, fn, resolve, arguments_));

    if (queue.length && activeCount < maxLimit) {
      queue.shift()?.()
    }
  }

  const generateAsyncControl = (fn, ...arguments_) => {
    return new Promise((resolve) => {
      enqueue(fn, resolve, arguments_)
    })
  }

  return generateAsyncControl
}


function asyncFun(value, delay) {
  return new Promise((resolve) => {
    // console.log('start ' + value);
    setTimeout(() => {
      console.log('end:', value)
      resolve(value)
    }, delay);
  });
}

const limit = pLimit(2);

(async () => {
  const arr = [
    // limit(() => asyncFun('aaa', 2000)),
    // limit(() => asyncFun('bbb', 3000)),
    // limit(() => asyncFun('ccc', 1000)),
    // limit(() => asyncFun('ccc', 1000)),
    // limit(() => asyncFun('ccc', 1000)),

    limit(() => asyncFun('aaa', 4000)),
    limit(() => asyncFun('bbb', 3000)),
    limit(() => asyncFun('ccc', 1000)),
    limit(() => asyncFun('ccc', 1000)),
    limit(() => asyncFun('ccc', 1000))
  ]

  const result = await Promise.all(arr)
  console.log('%c [ result ]-63', 'font-size:13px; background:pink; color:#bf2c9f;', result)

})()
```
