class ApplicationController < ActionController::API
    # ensure views can be rendered (disabled by default since this is an API)
    include ActionView::Layouts
    include ActionController::Rendering
end
