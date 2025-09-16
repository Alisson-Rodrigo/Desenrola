using Desenrola.Application.Contracts.Application;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Services
{

    /// <summary>
    /// Serviço responsável pelo envio de e-mails na aplicação.
    /// </summary>
    /// <remarks>
    /// Atualmente implementa o envio de e-mail para recuperação de senha,
    /// utilizando configurações fornecidas via <see cref="IConfiguration"/>.
    /// </remarks>
    public class Send : ISend
    {
        private readonly IConfiguration _configuration;

        public Send(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Envia um e-mail com o link para recuperação de senha.
        /// </summary>
        /// <param name="recipientEmail">E-mail do destinatário.</param>
        /// <param name="recoveryLink">Link para a recuperação de senha.</param>
        /// <returns>True se enviado com sucesso, false caso contrário.</returns>
        public bool SendRecoveryEmail(string recipientEmail, string recoveryLink)
        {
            try
            {
                string host = _configuration.GetValue<string>("SMTP:Host")!;
                string displayName = _configuration.GetValue<string>("SMTP:Nome")!;
                string senderEmail = _configuration.GetValue<string>("SMTP:UserName")!;
                string senderPassword = _configuration.GetValue<string>("SMTP:Senha")!;
                int port = _configuration.GetValue<int>("SMTP:Porta");

                MailMessage mail = new MailMessage
                {
                    From = new MailAddress(senderEmail, displayName)
                };

                mail.To.Add(recipientEmail);
                mail.Subject = "Recuperação de Senha";
                // Corpo em HTML com link de recuperação
                mail.Body = $@"
                    <html>
                        <body>
                            <p>Olá,</p>
                            <p>Para redefinir sua senha, clique no link abaixo:</p>
                            <p><a href='{recoveryLink}'>Recuperar Senha</a></p>
                            <p>Se você não solicitou a recuperação, ignore este e-mail.</p>
                        </body>
                    </html>";
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;

                using (SmtpClient smtp = new SmtpClient(host, port))
                {
                    smtp.Credentials = new NetworkCredential(senderEmail, senderPassword);
                    smtp.EnableSsl = true;
                    smtp.Send(mail);
                }

                Console.WriteLine("E-mail enviado com sucesso!");
                return true;
            }
            catch (Exception ex)
            {
                // Log detalhado para debug (em produção, opte por log sem detalhes sensíveis)
                Console.WriteLine("Erro ao enviar e-mail: " + ex.Message);
                Console.WriteLine("Stack Trace: " + ex.StackTrace);
                return false;
            }
        }
    }
}
