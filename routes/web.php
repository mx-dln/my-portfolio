<?php

use App\Http\Controllers\Admin\PortfolioAdminController;
use App\Http\Controllers\PortfolioChatController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', PortfolioController::class)->name('home');
Route::get('portfolio-chat/{conversation:uuid}', [PortfolioChatController::class, 'show'])->name('portfolio.chat.show');
Route::post('portfolio-chat', [PortfolioChatController::class, 'store'])->name('portfolio.chat.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [PortfolioAdminController::class, 'index'])->name('dashboard');
    Route::get('admin/portfolio', [PortfolioAdminController::class, 'index'])->name('admin.portfolio');
    Route::patch('admin/portfolio/profile', [PortfolioAdminController::class, 'updateProfile'])->name('admin.portfolio.profile.update');
    Route::post('admin/portfolio/projects', [PortfolioAdminController::class, 'storeProject'])->name('admin.portfolio.projects.store');
    Route::patch('admin/portfolio/projects/{project}', [PortfolioAdminController::class, 'updateProject'])->name('admin.portfolio.projects.update');
    Route::delete('admin/portfolio/projects/{project}', [PortfolioAdminController::class, 'destroyProject'])->name('admin.portfolio.projects.destroy');
    Route::post('admin/portfolio/conversations/{conversation}/reply', [PortfolioAdminController::class, 'replyToConversation'])->name('admin.portfolio.conversations.reply');
});

require __DIR__.'/settings.php';
