using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;


namespace UploadFile.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
        public async Task<IActionResult> OnPostUpload(IFormFile[] file)
        {
           
            // Kiểm tra xem tệp tin hình ảnh đã được chọn để tải lên hay chưa
            if (file == null || file.Length == 0)
                return new JsonResult("file not selected");

            // Tạo một đường dẫn tạm thời để lưu trữ hình ảnh tải lên
            for(int i = 0; i< file.Length; i++)
            {
                //CreateThumbnail(image[i]);
                var path = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot",
                "images", file[i].FileName);

                // Lưu trữ hình ảnh tải lên vào đường dẫn tạm thời
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file[i].CopyToAsync(stream);
                }
            }
            return new JsonResult("Index");
        }
        public async Task<IActionResult> OnPostCreateThumbnail(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                // Load image from stream
                var image = await Image.LoadAsync(stream);

                // Resize image to thumbnail size
                var thumbnail = image.Clone(x => x.Resize(new ResizeOptions
                {
                    Size = new SixLabors.ImageSharp.Size(1280, 720),
                    Mode = ResizeMode.Max
                }));

                // Save thumbnail to memory stream
                using (var memoryStream = new MemoryStream())
                {
                    var savePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", file.FileName); // đường dẫn và tên file muốn lưu
                    await thumbnail.SaveAsync(savePath, new JpegEncoder());
                    await thumbnail.SaveAsync(memoryStream, new JpegEncoder());
                    var thumbnailData = memoryStream.ToArray();
                    // Return thumbnail as file result
                    return File(thumbnailData, "image/jpeg", $"{file.FileName}-thumbnail.jpg");
                }
                
            }
        }
    }
}
