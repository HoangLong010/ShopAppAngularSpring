package com.project.shopapp.responses;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateUserResponse {
    @JsonProperty("fullname")
    private String fullName;

    private String address;

    private String password;

    @JsonProperty("date_of_birth")
    private Date dateOfBirth;

    @JsonProperty("facebook_account_id")
    private int facebookAccountId;

    @JsonProperty("google_account_id")
    private int googleAccountId;


}
