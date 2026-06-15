<?php

use App\Http\Controllers\Admin\PortfolioAdminController;
use App\Http\Controllers\Admin\PortfolioInboxController;
use App\Http\Controllers\Admin\PortfolioVisitorController;
use App\Http\Controllers\PortfolioChatController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', PortfolioController::class)->name('home');
Route::get('portfolio-chat/{conversation:uuid}', [PortfolioChatController::class, 'show'])->name('portfolio.chat.show');
Route::post('portfolio-chat', [PortfolioChatController::class, 'store'])->name('portfolio.chat.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [PortfolioAdminController::class, 'index'])->name('dashboard');
    Route::get('admin/inbox-feed', [PortfolioInboxController::class, 'feed'])->name('admin.inbox.feed');
    Route::get('admin/inbox-messages/{conversation}', [PortfolioInboxController::class, 'messages'])->name('admin.inbox.messages');
    Route::get('admin/inbox/{conversation?}', PortfolioInboxController::class)->name('admin.inbox');
    Route::get('admin/visitors', PortfolioVisitorController::class)->name('admin.visitors');
    Route::get('admin/hero', [PortfolioAdminController::class, 'hero'])->name('admin.hero');
    Route::patch('admin/hero', [PortfolioAdminController::class, 'updateHero'])->name('admin.hero.update');
    Route::get('admin/projects', [PortfolioAdminController::class, 'projects'])->name('admin.projects');
    Route::get('admin/capability-map', [PortfolioAdminController::class, 'capability'])->name('admin.capability');
    Route::patch('admin/capability-map', [PortfolioAdminController::class, 'updateCapability'])->name('admin.capability.update');
    Route::get('admin/experience', [PortfolioAdminController::class, 'experience'])->name('admin.experience');
    Route::post('admin/experience', [PortfolioAdminController::class, 'storeExperience'])->name('admin.experience.store');
    Route::patch('admin/experience/{experience}', [PortfolioAdminController::class, 'updateExperience'])->name('admin.experience.update');
    Route::delete('admin/experience/{experience}', [PortfolioAdminController::class, 'destroyExperience'])->name('admin.experience.destroy');
    Route::get('admin/contact', [PortfolioAdminController::class, 'contact'])->name('admin.contact');
    Route::patch('admin/contact', [PortfolioAdminController::class, 'updateContact'])->name('admin.contact.update');
    Route::get('admin/portfolio', [PortfolioAdminController::class, 'index'])->name('admin.portfolio');
    Route::patch('admin/portfolio/profile', [PortfolioAdminController::class, 'updateProfile'])->name('admin.portfolio.profile.update');
    Route::post('admin/portfolio/projects', [PortfolioAdminController::class, 'storeProject'])->name('admin.portfolio.projects.store');
    Route::patch('admin/portfolio/projects/{project}', [PortfolioAdminController::class, 'updateProject'])->name('admin.portfolio.projects.update');
    Route::delete('admin/portfolio/projects/{project}', [PortfolioAdminController::class, 'destroyProject'])->name('admin.portfolio.projects.destroy');
    Route::post('admin/portfolio/conversations/{conversation}/reply', [PortfolioAdminController::class, 'replyToConversation'])->name('admin.portfolio.conversations.reply');
});

require __DIR__.'/settings.php';
