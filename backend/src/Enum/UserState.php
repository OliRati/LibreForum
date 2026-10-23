<?php

namespace App\Enum;

enum UserState: string
{
    case ACTIVE = 'active';
    case DELETED = 'deleted';
    case BANNED = 'banned';
}
