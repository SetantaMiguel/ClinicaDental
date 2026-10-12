using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Core.Models
{
    [PrimaryKey(nameof(CitaId), nameof(CatalogoCitaId))]
    public class CitaDetalleCatalogo
    {
        [Required]
        public int CitaId { get; set; }

        [ForeignKey(nameof(CitaId))]
        public virtual Citas? Cita { get; set; }

        [Required]
        public int CatalogoCitaId { get; set; }

        [ForeignKey(nameof(CatalogoCitaId))]
        public virtual CatalogoCitas? CatalogoCita { get; set; }
    }
}
