# If jekyll-scholar reference has a url, turn it into a link that matches self-hosted PDF link stying
# https://github.com/inukshuk/jekyll-scholar/issues/30
require 'uri'
module UrlFilter
  class StripUrls < BibTeX::Filter
    def apply(value)
      value.to_s.gsub(URI.regexp(['http','https','ftp'])) { |c| "[<svg class=\"icon-pdf\"><use xlink\:href=\"#icon-pdf\"></use></svg><a href=\"#{$&}\" target=\"_blank\"><abbr>PDF</abbr></a>]" }
    end
  end
end
