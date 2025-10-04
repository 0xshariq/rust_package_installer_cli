class HomeController < ApplicationController
  def index
    render :index
  end

  def click
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.append('content', partial: 'content')
      end
    end
  end
end
