import { Provider } from '@angular/core';
import { MenuService } from './services/menu.service';
import { StorageService } from './services/storage.service';

export const CORE_PROVIDERS: Provider[] = [
    MenuService,
    StorageService
];
