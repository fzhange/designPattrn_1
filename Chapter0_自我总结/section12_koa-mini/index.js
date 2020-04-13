const http = require("http");

function compose(middlewares){
  return (ctx)=>{
    function executeMiddleWare(idx){
      if(idx ==  middlewares.length)  return;
      return middlewares[idx](ctx,()=>executeMiddleWare(idx+1))
    }
    return executeMiddleWare(0);
  }
}
class Context{
  constructor(req,res){
    this.req = req;
    this.res = res;
  }
}

class App{
  constructor(){
    this.middlewares = [];
  }
  listen(port){
    const server = http.createServer(async (req,res)=>{
      const fn = compose(this.middlewares);
      let ctx = new Context(req,res);
      try{
        await fn(ctx);
        ctx.res.end(ctx.body)
      }catch(error){
        console.error(error);
        ctx.res.statusCode = 500
        ctx.res.end('Internel Server Error');
      }
    });
    server.listen(port);
  }
  use(middleware){
   this.middlewares.push(middleware);
  }
}

/** EXAMPLE */
let app =  new App();
app.use(async (ctx, next) => {
  console.log('Middleware 1 Start')
  let nextMiddleWareName =  await next()
  console.log('nextMiddleWareName: ', nextMiddleWareName);
  console.log('Middleware 1 End')
})

app.use(async (ctx, next) => {
  console.log('Middleware 2 Start')
  await next()
  console.log('Middleware 2 End')
  ctx.body = 'hello, world'
  return "Middleware__2222222";
})

app.listen(8080);








