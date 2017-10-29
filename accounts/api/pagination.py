from rest_framework.pagination import (
    LimitOffsetPagination,
    PageNumberPagination,
)


class RequestLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 1000
    max_limit = 1000


class RequestPageNumberPagination(PageNumberPagination):
    page_size = 1000
