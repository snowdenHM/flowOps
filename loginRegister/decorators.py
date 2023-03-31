from django.contrib.auth.decorators import user_passes_test


# Anonymous required
def anonymous_required(function=None, redirect_url=None):
    if not redirect_url:
        redirect_url = 'dashboard/'
    actual_decorator = user_passes_test(
        lambda u: u.is_anonymous,
        login_url=redirect_url
    )
    if function:
        return actual_decorator(function)
    return actual_decorator
