using System.Net;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;

namespace RO.DevTest.Domain.Exception;

// [TODO] Standardize requests
// [TODO] Display a semantic error message to the client
/// <summary>
/// Returns a <see cref="HttpStatusCode.BadRequest"/> to
/// the request
/// </summary>
public class BadRequestException : ApiException {
    public override HttpStatusCode StatusCode => HttpStatusCode.BadRequest;
    public BadRequestException(IdentityResult result) : base(result) { }
    public BadRequestException(string error) : base(error) { }
    public BadRequestException(ValidationResult validationResult) : base(validationResult) { }
}
