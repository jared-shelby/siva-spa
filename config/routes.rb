Rails.application.routes.draw do
  resources :categories
  resources :transactions
  resources :milestones
  resources :users
end
