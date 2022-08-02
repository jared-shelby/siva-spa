Rails.application.routes.draw do
  resources :categories
  resources :transactions
  resources :goals
  resources :users
  resources :sessions

  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
end
