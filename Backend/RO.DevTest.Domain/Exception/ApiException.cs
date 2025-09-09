using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace RO.DevTest.Domain.Exception;

public abstract class ApiException : System.Exception {
    /// <summary>
    /// The <see cref="HttpStatusCode"/> of the <see cref="ApiException"/>
    /// </summary>
    public abstract HttpStatusCode StatusCode { get; }

    /// <summary>
    /// The errors that caused the <see cref="ApiException"/> to be
    /// raised
    /// </summary>
    public List<string> Errors { get; set; } = [];

    /// <summary>
    /// Initializes a new <see cref="ApiException"/>
    /// </summary>
    protected ApiException() : base() { }

    protected ApiException(string error) : this() {
        Errors = [error];
    }

    /// <summary>
    /// Initializes a new <see cref="ApiException"/>
    /// </summary>
    /// <param name="validationResult">
    /// The <see cref="ValidationResult"/> that caused the exception
    /// </param>
    protected ApiException(ValidationResult validationResult) : base() {
        Errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
    }

    /// <summary>
    /// Initializes a new <see cref="ApiException"/>
    /// </summary>
    /// <param name="identityResult">
    /// The <see cref="IdentityResult"/> that caused the exception
    /// </param>
    protected ApiException(IdentityResult identityResult) : base() {
        Errors = identityResult.Errors.Select(e => e.Description).ToList();
    }
}
