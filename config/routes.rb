Rails.application.routes.draw do
  resources :categories
  resources :transactions
  resources :goals
  resources :users
  # resources :sessions
end
