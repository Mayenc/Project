using System.ComponentModel.DataAnnotations;

namespace TestAuthentication.Models
{
    public class Register
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "Password and confirmation password did not math")]
        public string ConfirmPassword { get; set; }
    }
}
