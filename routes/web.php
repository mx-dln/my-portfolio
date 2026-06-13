<?php

use App\Http\Controllers\Admin\PortfolioAdminController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', PortfolioController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('admin/portfolio', [PortfolioAdminController::class, 'index'])->name('admin.portfolio');
    Route::patch('admin/portfolio/profile', [PortfolioAdminController::class, 'updateProfile'])->name('admin.portfolio.profile.update');
    Route::post('admin/portfolio/projects', [PortfolioAdminController::class, 'storeProject'])->name('admin.portfolio.projects.store');
    Route::patch('admin/portfolio/projects/{project}', [PortfolioAdminController::class, 'updateProject'])->name('admin.portfolio.projects.update');
    Route::delete('admin/portfolio/projects/{project}', [PortfolioAdminController::class, 'destroyProject'])->name('admin.portfolio.projects.destroy');
});

require __DIR__.'/settings.php';
