<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentityProviderModel extends Model
{
    use HasFactory;

    protected $table = 'IdentityProvider';

    protected $fillable = [
        'id',
        'provider_name'
    ];
}
