from django.db.models import Q

from rest_framework.serializers import (
                                CharField,
                                EmailField,
                                BooleanField,
                                ModelSerializer,
                                HyperlinkedIdentityField,
                                SerializerMethodField,
                                ValidationError,)

from ..models import User, IntranetURL, Branch
from reference_stats.models import Request
from rest_framework_jwt.settings import api_settings


class BranchListSerializer(ModelSerializer):
    class Meta:
        model = Branch
        fields = [
        'id',
        'name',
        ]

class IntranetURLSerializer(ModelSerializer):
    class Meta:
        model = IntranetURL
        fields = [
        'id',
        'url'
        ]

class UserDetailSerializer(ModelSerializer):
    branch = SerializerMethodField()
    startup_page = SerializerMethodField()
    startup_page_id = SerializerMethodField()
    ref_quant = SerializerMethodField()
    class Meta:
        model = User
        fields = [
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'is_admin',
        'branch',
        'startup_page',
        'startup_page_id',
        'calendar_preference',
        'calendar_condensed_view',
        'ref_quant',
        ]
    def get_branch(self, obj):
        return str(obj.branch.name)
    def get_startup_page(self, obj):
        return str(obj.startup_page.url)
    def get_startup_page_id(self, obj):
        return str(obj.startup_page.id)
    def get_ref_quant(self, obj):
        user = obj.username
        return str(Request.objects.filter(user__username=user).count())


class UserUpdateSerializer(ModelSerializer):
    email = EmailField(label='Email Address', allow_blank=True, required=False)
    branch = CharField(allow_blank=True, required=False)
    admin = BooleanField(required=False)
    password = CharField(allow_blank=True, required=False)
    class Meta:
        model = User
        fields = [
        'startup_page',
        'calendar_preference',
        'calendar_condensed_view',
        'password',
        'email',
        'branch',
        'admin',
        ]

class UserCreateSerializer(ModelSerializer):
    email = EmailField(label = 'Email Address')
    # email2 = EmailField(label = 'Confirm Email')
    class Meta:
        model = User
        fields = [
            'username',
            'password',  #should be a write only field
            'branch',
            'admin',
            'email',
        ]
        extra_kwargs = {"password":
                            {"write_only": True}
                        }
    # def validate(self, data):
    #     email = data['email']
    #     user_qs = User.objects.filter(email=email)
    #     if user_qs.exists():
    #         raise ValidationError("This user already exists in the system.")
    #     return data

    # def validate_email(self, value):
    #     data = self.get_initial()
    #     email1 = data.get("email2")
    #     email2 = value
    #     if email1 != email2:
    #         raise ValidationError("Emails must match.")
    #     user_qs = User.objects.filter(email=email2)
    #     if user_qs.exists():
    #         raise ValidationError("This user already exists in the system.")
    #
    #     return value

    #
    # def validate_email2(self, value):
    #     data = self.get_initial()
    #     email1 = data.get("email")
    #     email2 = value
    #     if email1 != email2:
    #         raise ValidationError("Emails must match.")
    #     return value

    def create(self, validated_data):
        username = validated_data['username']
        branch = validated_data['branch']
        email = validated_data['email']
        admin = validated_data['admin']
        password = validated_data['password']
        user_obj = User(
            username = username,
            branch = branch,
            admin = admin,
            email = email,
        )
        user_obj.set_password(password)
        user_obj.save()
        return validated_data


class UserLoginSerializer(ModelSerializer):
    token = CharField(allow_blank=True, read_only=True)
    username = CharField(required=True, allow_blank=True,)
    # email = EmailField(label = 'Email Address',required=False, allow_blank=True,)
    class Meta:
        model = User
        fields = [
            'username',
            # 'email',
            'password',
            'token',
        ]
        extra_kwargs = {"password":
                            {"write_only": True}
                        }

    def validate(self, data):
        user_obj = None
        email=data.get("email", None)
        username = data.get("username", None)
        password = data["password"]
        if not email and not username:
            raise ValidationError("A username or email is required to login.")
        user = User.objects.filter(
                Q(email=email)|
                Q(username = username)
        ).distinct()
        user = user.exclude(email__isnull=True).exclude(email__iexact='') #excludes the users without email
        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise ValidationError("This username/email is not valid.")
        if user_obj:
            if not user_obj.check_password(password):
                raise ValidationError("Incorrect credentials please try again.")

        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user_obj)
        token = jwt_encode_handler(payload)
        data["token"] = token
    #     email = data['email']
    #     user_qs = User.objects.filter(email=email)
    #     if user_qs.exists():
    #         raise ValidationError("This user already exists in the system.")
        return data
