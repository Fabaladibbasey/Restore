using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public ActionResult<string> GetNotFoundRequest()
    {

        return NotFound();
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest(new ProblemDetails
        {
            Title = "This is a bad request",
            Detail = "This is a bad request detail",
            Status = 400
        });
    }

    [HttpGet("unauthorized")]
    public ActionResult<string> GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("validation-error")]
    public ActionResult<string> GetValidationError()
    {
        ModelState.AddModelError("Test", "This is a test error");
        ModelState.AddModelError("Test2", "This is a test error 2");
        ModelState.AddModelError("Test3", "This is a test error 3");
        return ValidationProblem();
    }
}
