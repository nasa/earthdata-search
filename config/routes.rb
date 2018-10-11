EarthdataSearchClient::Application.routes.draw do
  get 'urs_callback' => 'oauth_tokens#urs_callback'
  get 'login' => 'users#login'
  get 'logout' => 'users#logout'
  get 'contact_info' => 'users#contact_info'
  get 'refresh_token' => 'oauth_tokens#refresh_token'

  resources :users, only: [:new, :create] do
    collection do
      get 'get_preferences'
      post 'update_notification_pref'
      get 'site_preferences' => 'users#get_site_preferences'
      post 'site_preferences' => 'users#set_site_preferences'
    end
  end

  get 'collection_facets' => 'collections#facets'
  resources :collections, only: [:index, :show], defaults: { format: 'json' } do
    member do
      post 'use'
    end
  end
  post 'collections/collection_relevancy' => 'collections#collection_relevancy'

  resources :granules, only: [:create, :show], defaults: { format: 'json' } do
    collection do
      post 'timeline'
      get 'download', defaults: { format: %w(html sh) }
      get 'fetch_links'

      get 'opendap_urls', format: :html
      get 'fetch_opendap_urls'
    end
  end

  resources :services, only: [:index, :show], defaults: { format: 'json' }
  match 'variables' => 'variables#index', defaults: { format: 'json' }, via: [:get, :post]

  resources :docs

  get 'projects/new' => 'projects#new', format: 'html'
  get 'projects/:id' => 'projects#show', defaults: { format: 'html' }
  # get 'search/project' => 'projects#show', defaults: { format: 'html' }
  post 'projects' => 'projects#create', defaults: { format: 'text' }
  get 'projects' => 'projects#index', format: 'html'
  post 'projects/remove' => 'projects#remove', format: 'json'

  resources :placenames, only: [:index], defaults: { format: 'json' }

  post 'convert' => 'conversions#convert'
  resources :convert, only: [:create], defaults: { format: 'json' }

  get 'cwic/edsc_granule(/*cwic_path)' => 'cwic#granule'
  get 'cwic/edsc_download(/*cwic_path)' => 'cwic#download', format: 'html'
  get 'cwic(/*cwic_path)' => 'cwic#index'

  match 'data/options' => 'data_access#options', format: 'json', via: [:get, :post]

  post 'data/retrieve' => 'data_access#retrieve'
  get 'data/retrieve/:id' => 'data_access#retrieval'
  get 'data/status' => 'data_access#status'
  post 'data/remove' => 'data_access#remove', format: 'json'

  post 'metrics' => 'search#log_metrics_event'

  get 'search(/*overlay_params)' => 'search#index'
  get 'extract_filters' => 'search#extract_filters', format: 'json'

  get 'health' => 'health#index', format: 'json'

  root to: 'search#index'
end
