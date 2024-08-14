
export function GET(req:Request){
    console.log(req);
    // console.log("hi");
    return Response.json({
        message:"Hi from test"
    },{status:200});
}