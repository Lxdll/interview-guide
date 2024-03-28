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